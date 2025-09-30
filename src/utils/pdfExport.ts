import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportObservationToPDF(
  observation: any,
  entries: any[]
) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin

  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Beobachtungsbogen', margin, yPosition)
  yPosition += 10

  // Meta Information
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Schule: ${observation.school}`, margin, yPosition)
  yPosition += 7
  pdf.text(`Klasse: ${observation.grade}`, margin, yPosition)
  yPosition += 7
  pdf.text(`Dauer: ${observation.duration} Minuten`, margin, yPosition)
  yPosition += 7
  pdf.text(`Erstellt am: ${new Date(observation.created_at).toLocaleDateString('de-DE')}`, margin, yPosition)
  yPosition += 10

  if (observation.class_comment) {
    pdf.setFont('helvetica', 'italic')
    pdf.text(`Kommentar: ${observation.class_comment}`, margin, yPosition)
    yPosition += 10
  }

  // Table Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFillColor(59, 130, 246) // Blue
  pdf.setTextColor(255, 255, 255)
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F')
  
  const timeColX = margin + 5
  const happenedColX = margin + 35
  const commentColX = margin + 105

  pdf.text('Zeit (min)', timeColX, yPosition + 7)
  pdf.text('Was ist passiert?', happenedColX, yPosition + 7)
  pdf.text('Kommentar', commentColX, yPosition + 7)
  yPosition += 12

  // Table Rows
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(0, 0, 0)

  entries.forEach((entry, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = margin
    }

    // Zebra striping
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251)
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F')
    }

    pdf.text(entry.time_min || '', timeColX, yPosition)
    
    // Wrap text for long content
    const happenedText = pdf.splitTextToSize(entry.happened || '', 65)
    const commentText = pdf.splitTextToSize(entry.comment || '', 75)
    
    pdf.text(happenedText, happenedColX, yPosition)
    pdf.text(commentText, commentColX, yPosition)
    
    const maxLines = Math.max(happenedText.length, commentText.length)
    yPosition += maxLines * 5 + 5
  })

  // Save PDF
  const fileName = `Beobachtung_${observation.school}_${observation.grade}_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

export async function exportJournalToPDF(entry: any) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 15
  let yPosition = margin

  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Journal-Eintrag', margin, yPosition)
  yPosition += 10

  // Date
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Datum: ${new Date(entry.entry_date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition)
  yPosition += 10

  // Mood and Effort
  const moodLabels = ['Sehr schlecht', 'Schlecht', 'Neutral', 'Gut', 'Sehr gut']
  const effortLabels = ['Sehr wenig', 'Wenig', 'Mittel', 'Viel', 'Sehr viel']
  
  pdf.text(`Stimmung: ${moodLabels[entry.mood - 1]}`, margin, yPosition)
  yPosition += 7
  pdf.text(`Anstrengung: ${effortLabels[entry.effort - 1]}`, margin, yPosition)
  yPosition += 7
  pdf.text(`Mit Betreuer:in geteilt: ${entry.shared_with_tutor ? 'Ja' : 'Nein'}`, margin, yPosition)
  yPosition += 12

  // Content
  pdf.setFont('helvetica', 'bold')
  pdf.text('Inhalt:', margin, yPosition)
  yPosition += 7

  pdf.setFont('helvetica', 'normal')
  const contentLines = pdf.splitTextToSize(entry.body, pageWidth - 2 * margin)
  contentLines.forEach((line: string) => {
    if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage()
      yPosition = margin
    }
    pdf.text(line, margin, yPosition)
    yPosition += 7
  })

  // Save PDF
  const fileName = `Journal_${new Date(entry.entry_date).toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
